/* VMP-by-Summer-Soldier
*
* Copyright (C) 2020 SUMMER SOLDIER
*
* This file is part of VMP-by-Summer-Soldier
*
* VMP-by-Summer-Soldier is free software: you can redistribute it and/or modify it
* under the terms of the GNU General Public License as published by the Free
* Software Foundation, either version 3 of the License, or (at your option)
* any later version.
*
* VMP-by-Summer-Soldier is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License along with
* VMP-by-Summer-Soldier. If not, see http://www.gnu.org/licenses/.
*/

"use strict";

var db = require('../db/db_bridge');
const config = require('../config/config.json')
const table = config.serverTable

/**
 *   server Model
 */
var panelServerModal = {

  /**
 * create table if not exists
 */
  createTheTableIfNotExists: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`CREATE TABLE IF NOT EXISTS ${table} (
                                    id int(10) unsigned NOT NULL AUTO_INCREMENT,
                                    tbl_name varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    server_name varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    server_ip varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                    server_port varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                    server_rcon_pass varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                    created_at datetime DEFAULT NULL,
                                    PRIMARY KEY (id)
                                  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in creating user table");
        }
        return resolve(true);
      } catch (error) {
        console.log("error in createTheTableIfNotExists->", error)
        reject(error)
      }
    });
  },

  /**
   * get all the servers
   */
  getPanelServersDisplayList: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`SELECT tbl_name, server_name FROM ${table} `);
        let queryRes = await db.query(query);
        if (!queryRes) {
          return reject("No Data Found");
        }
        return resolve(queryRes);
      } catch (error) {
        console.log("error in getPanelServersList->", error)
        reject(error)
      }
    });
  },

  /**
 * get all the servers
 */
  getPanelServersList: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`SELECT * FROM ${table} `);
        let queryRes = await db.query(query);
        if (!queryRes) {
          return reject("No Data Found");
        }
        return resolve(queryRes);
      } catch (error) {
        console.log("error in getPanelServersList->", error)
        reject(error)
      }
    });
  },


  /**
 * Insert a new server
 */
  insertNewPanelServer: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!dataObj.tablename) return reject("Table Name is not provided");
        if (!dataObj.servername) return reject("Server Name is not provided");

        let query = db.queryFormat(`show tables`);
        let queryRes = await db.query(query);
        if (!queryRes) {
          return reject("Error in insertion");
        }

        let tablesArray = []
        for (let i = 0; i < queryRes.length; i++) {
          tablesArray.push(queryRes[i].Tables_in_GGVIPlist)
        }

        if (tablesArray.includes(dataObj.tablename)) {
          query = db.queryFormat(`INSERT INTO ${table} (tbl_name, server_name, created_at) VALUES (?, ?, ?)`, [dataObj.tablename, dataObj.servername, new Date()]);
          queryRes = await db.query(query, true);
          if (!queryRes) {
            return reject("Error in insertion");
          }
          return resolve(queryRes);
        } else {
          return reject("Server/table not found, Please add vmpanel plugin in your server then add here.");
        }
      } catch (error) {
        console.log("error in insertNewPanelServer->", error)
        reject(error)
      }
    });
  },

  /**
* Delete a  server
*/
  deletePanelServer: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!dataObj.id) return reject("id is not provided");
        if (!dataObj.tablename) return reject("Table Name is not provided");

        let query = db.queryFormat(`DELETE FROM ${table} WHERE id = ? AND tbl_name = ?`, [dataObj.id, dataObj.tablename]);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in delete");
        }
        return resolve(queryRes);
      } catch (error) {
        console.log("error in deletePanelServer->", error)
        reject(error)
      }
    });
  },

}

module.exports = panelServerModal;