/* eslint no-restricted-imports: 0 */
/* eslint-disable no-unused-vars */

/*
  THIS IS A GENERATED FILE
  Changes might be overwritten in the future, edit with caution!

  Wrapper functions around functions in airtable.js that interact with Airtable, designed
  to provide basic functionality

  If you're adding a new function: make sure you add a corresponding test (at least 1) for it in request.spec.js

*/

import { Tables, Columns } from './schema';
import {
  createRecord,
  createRecords,
  updateRecord,
  updateRecords,
  getAllRecords,
  getRecordsByAttribute,
  getRecordById,
  deleteRecord,
} from './airtable';

/*
 ******* CREATE RECORDS *******
 */

export const createTrip = async (record) => {
  return createRecord(Tables.Trips, record);
};

export const createManyTrips = async (records) => {
  const createPromises = [];
  const numCalls = Math.ceil(records.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = records.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      createPromises.push(createRecords(Tables.Trips, subset));
  }
  return Promise.all(createPromises);
};

export const createClient = async (record) => {
  return createRecord(Tables.Clients, record);
};

export const createManyClients = async (records) => {
  const createPromises = [];
  const numCalls = Math.ceil(records.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = records.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      createPromises.push(createRecords(Tables.Clients, subset));
  }
  return Promise.all(createPromises);
};

export const createUser = async (record) => {
  return createRecord(Tables.Users, record);
};

export const createManyUsers = async (records) => {
  const createPromises = [];
  const numCalls = Math.ceil(records.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = records.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      createPromises.push(createRecords(Tables.Users, subset));
  }
  return Promise.all(createPromises);
};

export const createTaskStage = async (record) => {
  return createRecord(Tables.TaskStages, record);
};

export const createManyTaskStages = async (records) => {
  const createPromises = [];
  const numCalls = Math.ceil(records.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = records.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      createPromises.push(createRecords(Tables.TaskStages, subset));
  }
  return Promise.all(createPromises);
};

export const createTaskList = async (record) => {
  return createRecord(Tables.TaskLists, record);
};

export const createManyTaskLists = async (records) => {
  const createPromises = [];
  const numCalls = Math.ceil(records.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = records.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      createPromises.push(createRecords(Tables.TaskLists, subset));
  }
  return Promise.all(createPromises);
};

export const createTaskListTemplate = async (record) => {
  return createRecord(Tables.TaskListTemplates, record);
};

export const createManyTaskListTemplates = async (records) => {
  const createPromises = [];
  const numCalls = Math.ceil(records.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = records.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      createPromises.push(createRecords(Tables.TaskListTemplates, subset));
  }
  return Promise.all(createPromises);
};

export const createTaskInstance = async (record) => {
  return createRecord(Tables.TaskInstances, record);
};

export const createManyTaskInstances = async (records) => {
  const createPromises = [];
  const numCalls = Math.ceil(records.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = records.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      createPromises.push(createRecords(Tables.TaskInstances, subset));
  }
  return Promise.all(createPromises);
};

export const createTaskListTemplatesSafetomodify = async (record) => {
  return createRecord(Tables.TaskListTemplatesSafetomodify, record);
};

export const createManyTaskListTemplatesSafetomodifys = async (records) => {
  const createPromises = [];
  const numCalls = Math.ceil(records.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = records.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      createPromises.push(createRecords(Tables.TaskListTemplatesSafetomodify, subset));
  }
  return Promise.all(createPromises);
};

export const createTaskListInstance = async (record) => {
  return createRecord(Tables.TaskListInstances, record);
};

export const createManyTaskListInstances = async (records) => {
  const createPromises = [];
  const numCalls = Math.ceil(records.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = records.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      createPromises.push(createRecords(Tables.TaskListInstances, subset));
  }
  return Promise.all(createPromises);
};

/*
 ******* READ RECORDS *******
 */

export const getTripById = async (id) => {
  return getRecordById(Tables.Trips, id);
};

export const getTripsByIds = async ( ids, filterByFormula = '', sort = []
) => {
  let formula = `OR(${ids.reduce(
    (f, id) => `${f} RECORD_ID()='${id}',`,
    ''
  )} 1 < 0)`;
  formula = filterByFormula ? `AND(${filterByFormula}, ${formula})` : formula;
  return getAllRecords(Tables.Trips, formula, sort);
};

export const getAllTrips = async (filterByFormula = '', sort = []) => {
  return getAllRecords(Tables.Trips, filterByFormula, sort);
};

export const getClientById = async (id) => {
  return getRecordById(Tables.Clients, id);
};

export const getClientsByIds = async ( ids, filterByFormula = '', sort = []
) => {
  let formula = `OR(${ids.reduce(
    (f, id) => `${f} RECORD_ID()='${id}',`,
    ''
  )} 1 < 0)`;
  formula = filterByFormula ? `AND(${filterByFormula}, ${formula})` : formula;
  return getAllRecords(Tables.Clients, formula, sort);
};

export const getAllClients = async (filterByFormula = '', sort = []) => {
  return getAllRecords(Tables.Clients, filterByFormula, sort);
};

export const getUserById = async (id) => {
  return getRecordById(Tables.Users, id);
};

export const getUsersByIds = async ( ids, filterByFormula = '', sort = []
) => {
  let formula = `OR(${ids.reduce(
    (f, id) => `${f} RECORD_ID()='${id}',`,
    ''
  )} 1 < 0)`;
  formula = filterByFormula ? `AND(${filterByFormula}, ${formula})` : formula;
  return getAllRecords(Tables.Users, formula, sort);
};

export const getAllUsers = async (filterByFormula = '', sort = []) => {
  return getAllRecords(Tables.Users, filterByFormula, sort);
};

export const getTaskStageById = async (id) => {
  return getRecordById(Tables.TaskStages, id);
};

export const getTaskStagesByIds = async ( ids, filterByFormula = '', sort = []
) => {
  let formula = `OR(${ids.reduce(
    (f, id) => `${f} RECORD_ID()='${id}',`,
    ''
  )} 1 < 0)`;
  formula = filterByFormula ? `AND(${filterByFormula}, ${formula})` : formula;
  return getAllRecords(Tables.TaskStages, formula, sort);
};

export const getAllTaskStages = async (filterByFormula = '', sort = []) => {
  return getAllRecords(Tables.TaskStages, filterByFormula, sort);
};

export const getTaskListById = async (id) => {
  return getRecordById(Tables.TaskLists, id);
};

export const getTaskListsByIds = async ( ids, filterByFormula = '', sort = []
) => {
  let formula = `OR(${ids.reduce(
    (f, id) => `${f} RECORD_ID()='${id}',`,
    ''
  )} 1 < 0)`;
  formula = filterByFormula ? `AND(${filterByFormula}, ${formula})` : formula;
  return getAllRecords(Tables.TaskLists, formula, sort);
};

export const getAllTaskLists = async (filterByFormula = '', sort = []) => {
  return getAllRecords(Tables.TaskLists, filterByFormula, sort);
};

export const getTaskListTemplateById = async (id) => {
  return getRecordById(Tables.TaskListTemplates, id);
};

export const getTaskListTemplatesByIds = async ( ids, filterByFormula = '', sort = []
) => {
  let formula = `OR(${ids.reduce(
    (f, id) => `${f} RECORD_ID()='${id}',`,
    ''
  )} 1 < 0)`;
  formula = filterByFormula ? `AND(${filterByFormula}, ${formula})` : formula;
  return getAllRecords(Tables.TaskListTemplates, formula, sort);
};

export const getAllTaskListTemplates = async (filterByFormula = '', sort = []) => {
  return getAllRecords(Tables.TaskListTemplates, filterByFormula, sort);
};

export const getTaskInstanceById = async (id) => {
  return getRecordById(Tables.TaskInstances, id);
};

export const getTaskInstancesByIds = async ( ids, filterByFormula = '', sort = []
) => {
  let formula = `OR(${ids.reduce(
    (f, id) => `${f} RECORD_ID()='${id}',`,
    ''
  )} 1 < 0)`;
  formula = filterByFormula ? `AND(${filterByFormula}, ${formula})` : formula;
  return getAllRecords(Tables.TaskInstances, formula, sort);
};

export const getAllTaskInstances = async (filterByFormula = '', sort = []) => {
  return getAllRecords(Tables.TaskInstances, filterByFormula, sort);
};

export const getTaskListTemplatesSafetomodifyById = async (id) => {
  return getRecordById(Tables.TaskListTemplatesSafetomodify, id);
};

export const getTaskListTemplatesSafetomodifysByIds = async ( ids, filterByFormula = '', sort = []
) => {
  let formula = `OR(${ids.reduce(
    (f, id) => `${f} RECORD_ID()='${id}',`,
    ''
  )} 1 < 0)`;
  formula = filterByFormula ? `AND(${filterByFormula}, ${formula})` : formula;
  return getAllRecords(Tables.TaskListTemplatesSafetomodify, formula, sort);
};

export const getAllTaskListTemplatesSafetomodifys = async (filterByFormula = '', sort = []) => {
  return getAllRecords(Tables.TaskListTemplatesSafetomodify, filterByFormula, sort);
};

export const getTaskListInstanceById = async (id) => {
  return getRecordById(Tables.TaskListInstances, id);
};

export const getTaskListInstancesByIds = async ( ids, filterByFormula = '', sort = []
) => {
  let formula = `OR(${ids.reduce(
    (f, id) => `${f} RECORD_ID()='${id}',`,
    ''
  )} 1 < 0)`;
  formula = filterByFormula ? `AND(${filterByFormula}, ${formula})` : formula;
  return getAllRecords(Tables.TaskListInstances, formula, sort);
};

export const getAllTaskListInstances = async (filterByFormula = '', sort = []) => {
  return getAllRecords(Tables.TaskListInstances, filterByFormula, sort);
};

/*
 ******* UPDATE RECORDS *******
 */

export const updateTrip = async (id, recordUpdates) => {
  return updateRecord(Tables.Trips, id, recordUpdates);
};

export const updateManyTrips = async (recordUpdates) => {
  const updatePromises = [];
  const numCalls = Math.ceil(recordUpdates.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = recordUpdates.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      updatePromises.push(updateRecords(Tables.Trips, subset));
  }
  return Promise.all(updatePromises);
};

export const updateClient = async (id, recordUpdates) => {
  return updateRecord(Tables.Clients, id, recordUpdates);
};

export const updateManyClients = async (recordUpdates) => {
  const updatePromises = [];
  const numCalls = Math.ceil(recordUpdates.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = recordUpdates.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      updatePromises.push(updateRecords(Tables.Clients, subset));
  }
  return Promise.all(updatePromises);
};

export const updateUser = async (id, recordUpdates) => {
  return updateRecord(Tables.Users, id, recordUpdates);
};

export const updateManyUsers = async (recordUpdates) => {
  const updatePromises = [];
  const numCalls = Math.ceil(recordUpdates.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = recordUpdates.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      updatePromises.push(updateRecords(Tables.Users, subset));
  }
  return Promise.all(updatePromises);
};

export const updateTaskStage = async (id, recordUpdates) => {
  return updateRecord(Tables.TaskStages, id, recordUpdates);
};

export const updateManyTaskStages = async (recordUpdates) => {
  const updatePromises = [];
  const numCalls = Math.ceil(recordUpdates.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = recordUpdates.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      updatePromises.push(updateRecords(Tables.TaskStages, subset));
  }
  return Promise.all(updatePromises);
};

export const updateTaskList = async (id, recordUpdates) => {
  return updateRecord(Tables.TaskLists, id, recordUpdates);
};

export const updateManyTaskLists = async (recordUpdates) => {
  const updatePromises = [];
  const numCalls = Math.ceil(recordUpdates.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = recordUpdates.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      updatePromises.push(updateRecords(Tables.TaskLists, subset));
  }
  return Promise.all(updatePromises);
};

export const updateTaskListTemplate = async (id, recordUpdates) => {
  return updateRecord(Tables.TaskListTemplates, id, recordUpdates);
};

export const updateManyTaskListTemplates = async (recordUpdates) => {
  const updatePromises = [];
  const numCalls = Math.ceil(recordUpdates.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = recordUpdates.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      updatePromises.push(updateRecords(Tables.TaskListTemplates, subset));
  }
  return Promise.all(updatePromises);
};

export const updateTaskInstance = async (id, recordUpdates) => {
  return updateRecord(Tables.TaskInstances, id, recordUpdates);
};

export const updateManyTaskInstances = async (recordUpdates) => {
  const updatePromises = [];
  const numCalls = Math.ceil(recordUpdates.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = recordUpdates.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      updatePromises.push(updateRecords(Tables.TaskInstances, subset));
  }
  return Promise.all(updatePromises);
};

export const updateTaskListTemplatesSafetomodify = async (id, recordUpdates) => {
  return updateRecord(Tables.TaskListTemplatesSafetomodify, id, recordUpdates);
};

export const updateManyTaskListTemplatesSafetomodifys = async (recordUpdates) => {
  const updatePromises = [];
  const numCalls = Math.ceil(recordUpdates.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = recordUpdates.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      updatePromises.push(updateRecords(Tables.TaskListTemplatesSafetomodify, subset));
  }
  return Promise.all(updatePromises);
};

export const updateTaskListInstance = async (id, recordUpdates) => {
  return updateRecord(Tables.TaskListInstances, id, recordUpdates);
};

export const updateManyTaskListInstances = async (recordUpdates) => {
  const updatePromises = [];
  const numCalls = Math.ceil(recordUpdates.length / 10);
  for (let i = 0; i < numCalls; i += 1) {
    const subset = recordUpdates.slice(i * 10, (i + 1) * 10);
    if (subset.length > 0)
      updatePromises.push(updateRecords(Tables.TaskListInstances, subset));
  }
  return Promise.all(updatePromises);
};

/*
 ******* DELETE RECORDS *******
 */

export const deleteTrip = async (id) => {
  return deleteRecord(Tables.Trips, id);
};
export const deleteClient = async (id) => {
  return deleteRecord(Tables.Clients, id);
};
export const deleteUser = async (id) => {
  return deleteRecord(Tables.Users, id);
};
export const deleteTaskStage = async (id) => {
  return deleteRecord(Tables.TaskStages, id);
};
export const deleteTaskList = async (id) => {
  return deleteRecord(Tables.TaskLists, id);
};
export const deleteTaskListTemplate = async (id) => {
  return deleteRecord(Tables.TaskListTemplates, id);
};
export const deleteTaskInstance = async (id) => {
  return deleteRecord(Tables.TaskInstances, id);
};
export const deleteTaskListTemplatesSafetomodify = async (id) => {
  return deleteRecord(Tables.TaskListTemplatesSafetomodify, id);
};
export const deleteTaskListInstance = async (id) => {
  return deleteRecord(Tables.TaskListInstances, id);
};
