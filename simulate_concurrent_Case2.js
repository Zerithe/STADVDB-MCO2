import { centralNodeConnection, luzonNodeConnection, visMinNodeConnection } from './DBConn.js';

// Function to simulate a write transaction in the central node
async function writeCentralNode() {
    try {
        const transaction = await centralNodeConnection.transaction();
        const result = await centralNodeConnection.query('UPDATE appointments SET status = ? WHERE apptid = ?', {
            replacements: ['Cancelled', '0000F35265B8C5913394D60B048D0763'],
            transaction
        });
        await transaction.commit();
        return result; // Return the result
    } catch (error) {
        console.error('Error writing to central node:', error);
        throw error;
    }
}

// Function to simulate a read transaction in the Luzon node
async function readLuzonNode() {
    try {
        const transaction = await luzonNodeConnection.transaction();
        const result = await luzonNodeConnection.query('SELECT * FROM appointments WHERE apptid = ?', {
            replacements: ['0000F35265B8C5913394D60B048D0763'],
            transaction
        });
        await transaction.commit();
        return result; // Return the result
    } catch (error) {
        console.error('Error reading from Luzon node:', error);
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
    const [writeResult, luzonResult, visMinResult] = await Promise.all([writeCentralNode(), readLuzonNode(), readVisMinNode()]);
    console.log('Central Node Write Result:', writeResult[0]);
    console.log('Luzon Node Read Result:', luzonResult[0]);
    console.log('VisMin Node Read Result:', visMinResult[0]);
}

// Execute simulation
simulateConcurrentTransactions();
