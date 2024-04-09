import { centralNodeConnection, luzonNodeConnection, visMinNodeConnection } from './DBConn.js';

// Function to simulate a write transaction in the VisMin node
async function writeVisMinNode() {
    try {
        const transaction = await visMinNodeConnection.transaction();
        const result = await visMinNodeConnection.query('UPDATE appointments SET status = ? WHERE apptid = ?', {
            replacements: ['Cancelled', '000186EC494D0D246030F8CB42EB27DB'],
            transaction
        });
        await transaction.commit();
        return result; // Return the result
    } catch (error) {
        console.error('Error writing to VisMin node:', error);
        throw error;
    }
}

// Function to simulate a read transaction in the Central node
async function readCentralNode() {
    try {
        const transaction = await centralNodeConnection.transaction();
        const result = await centralNodeConnection.query('SELECT * FROM appointments WHERE apptid = ?', {
            replacements: ['000186EC494D0D246030F8CB42EB27DB'],
            transaction
        });
        await transaction.commit();
        return result; // Return the result
    } catch (error) {
        console.error('Error reading from Central node:', error);
        throw error;
    }
}

// Function to simulate a read transaction in the Luzon node
async function readLuzonNode() {
    try {
        const transaction = await luzonNodeConnection.transaction();
        const result = await luzonNodeConnection.query('SELECT * FROM appointments WHERE apptid = ?', {
            replacements: ['000186EC494D0D246030F8CB42EB27DB'],
            transaction
        });
        await transaction.commit();
        return result; // Return the result
    } catch (error) {
        console.error('Error reading from Luzon node:', error);
        throw error;
    }
}

// Simulate concurrent transactions in all nodes
async function simulateConcurrentTransactions() {
    const [writeResult, centralResult, luzonResult] = await Promise.all([writeVisMinNode(), readCentralNode(), readLuzonNode()]);
    console.log('VisMin Node Write Result:', writeResult[0]);
    console.log('Central Node Read Result:', centralResult[0]);
    console.log('Luzon Node Read Result:', luzonResult[0]);
}

// Execute simulation
simulateConcurrentTransactions();
