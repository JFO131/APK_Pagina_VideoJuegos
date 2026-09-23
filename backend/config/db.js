const path = require('path');

if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');

  function transformarSqlPostgres(sql, args) {
    if (args.length === 1 && args[0] && typeof args[0] === 'object' && !Array.isArray(args[0])) {
      const valores = [];
      const sqlTransformado = sql.replace(/@([A-Za-z0-9_]+)/g, (_, nombre) => {
        if (typeof args[0][nombre] === 'undefined') {
          throw new Error(`Falta el valor para el parámetro "${nombre}"`);
        }
        valores.push(args[0][nombre]);
        return `$${valores.length}`;
      });

      return { sql: sqlTransformado, params: valores };
    }

    const valores = args.flat();
    let indice = 0;
    const sqlTransformado = sql.replace(/\?/g, () => {
      indice += 1;
      return `$${indice}`;
    });

    return { sql: sqlTransformado, params: valores };
  }

  async function ejecutarSql(target, sql, args = []) {
    const { sql: sqlTransformado, params } = transformarSqlPostgres(sql, args);
    return target.query(sqlTransformado, params);
  }

  function prepararConsulta(target, sql) {
    return {
      get: async (...args) => {
        const resultado = await ejecutarSql(target, sql, args);
        return resultado.rows[0];
      },
      all: async (...args) => {
        const resultado = await ejecutarSql(target, sql, args);
        return resultado.rows;
      },
      run: async (...args) => {
        let consulta = sql;
        const esInsert = /^\s*INSERT\b/i.test(sql);
        if (esInsert) {
          consulta = `${sql.trim().replace(/;\s*$/, '')} RETURNING id`;
        }

        const resultado = await ejecutarSql(target, consulta, args);
        return {
          lastInsertRowid: resultado.rows?.[0]?.id ?? null,
          changes: resultado.rowCount ?? 0,
        };
      },
    };
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  module.exports = {
    prepare(sql) {
      return prepararConsulta(pool, sql);
    },
    async exec(sql, ...args) {
      return ejecutarSql(pool, sql, args);
    },
    transaction(callback) {
      return async (...args) => {
        const cliente = await pool.connect();
        await cliente.query('BEGIN');

        try {
          const dbTransaccional = {
            prepare(sql) {
              return prepararConsulta(cliente, sql);
            },
            async exec(sql, ...rest) {
              return ejecutarSql(cliente, sql, rest);
            },
          };

          const resultado = await callback(dbTransaccional, ...args);
          await cliente.query('COMMIT');
          return resultado;
        } catch (error) {
          await cliente.query('ROLLBACK');
          throw error;
        } finally {
          cliente.release();
        }
      };
    },
  };
} else {
  const Database = require('better-sqlite3');
  const rutaBaseDeDatos = path.join(__dirname, '..', 'database', 'tienda.db');
  const db = new Database(rutaBaseDeDatos);
  db.pragma('journal_mode = WAL');

  module.exports = db;
}
