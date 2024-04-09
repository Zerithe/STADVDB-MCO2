import { centralNodeConnection, luzonNodeConnection, visMinNodeConnection } from './DBConn.js';

// Function to simulate a write transaction in the Luzon node
async function writeLuzonNode() {
    try {
        const transaction = await luzonNodeConnection.transaction();
        const result = await luzonNodeConnection.query('UPDATE appointments SET status = ? WHERE apptid = ?', {
            replacements: ['Cancelled', '0000F35265B8C5913394D60B048D0763'],
            transaction
        });
        await transaction.commit();
        return result; // Return the result
    } catch (error) {
        console.error('Error writing to Luzon node:', error);
        throw error;
    }
}

// Function to simulate a read transaction in the Central node
async function readCentralNode() {
    try {
        const transaction = await centralNodeConnection.transaction();
        const result = await centralNodeConnection.query('SELECT * FROM appointments WHERE apptid = ?', {
            replacements: ['0000F35265B8C5913394D60B048D0763'],
            transaction
        });
        await transaction.commit();
        return result; // Return the result
    } catch (error) {
        console.error('Error reading from Central node:', error);
        throw error;
    }
}

// Function to simulate a read transaction in the VisMin node
async function readVisMinNode() {
    try {
        const transaction = await visMinNodeConnection.transaction();
        const result = await visMinNodeConnection.query('SELECT * FROM appointments WHERE apptid = ?', {
            replacements: ['0000F35265B8C5913394D60B048D0763'],
            transaction
        });
        await transaction.commit();
        return result; // Return the result
    } catch (error) {
        console.error('Error reading from VisMin node:', error);
        throw error;
    }
}

// Simulate concurrent transactions in all nodes
async function simulateConcurrentTransactions() {
    const [writeResult, centralResult, visMinResult] = await Promise.all([writeLuzonNode(), readCentralNode(), readVisMinNode()]);
    console.log('Luzon Node Write Result:', writeResult[0]);
    console.log('Central Node Read Result:', centralResult[0]);
    console.log('VisMin Node Read Result:', visMinResult[0]);
}

// Execute simulation
simulateConcurrentTransactions();
