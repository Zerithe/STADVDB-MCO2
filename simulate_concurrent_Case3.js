import { centralNodeConnection, luzonNodeConnection, visMinNodeConnection } from './DBConn.js';

// Function to simulate a write transaction in the central node
async function writeCentralNode() {
    try {
        const transaction = await centralNodeConnection.transaction();
        const result = await centralNodeConnection.query('UPDATE appointments SET status = ? WHERE apptid = ?', {
            replacements: ['Complete', '0000F35265B8C5913394D60B048D0763'],
            transaction
        });
        await transaction.commit();
        return result; // Return the result to prevent duplicate printing
    } catch (error) {
        console.error('Error writing to central node:', error);
    }
}

// Function to simulate a write transaction in the Luzon node
async function writeLuzonNode() {
    try {
        const transaction = await luzonNodeConnection.transaction();
        const result = await luzonNodeConnection.query('UPDATE appointments SET status = ? WHERE apptid = ?', {
            replacements: ['Complete', '0000F35265B8C5913394D60B048D0763'],
            transaction
        });
        await transaction.commit();
        return result; // Return the result to prevent duplicate printing
    } catch (error) {
        console.error('Error writing to Luzon node:', error);
    }
}

// Function to simulate a write transaction in the VisMin node
async function writeVisMinNode() {
    try {
        const transaction = await visMinNodeConnection.transaction();
        const result = await visMinNodeConnection.query('UPDATE appointments SET status = ? WHERE apptid = ?', {
            replacements: ['Complete', '0000F35265B8C5913394D60B048D0763'],
            transaction
        });
        await transaction.commit();
        return result; // Return the result to prevent duplicate printing
    } catch (error) {
        console.error('Error writing to VisMin node:', error);
    }
}

// Simulate concurrent transactions in all nodes
async function simulateConcurrentTransactions() {
    const [centralNodeResult, luzonResult, visMinResult] = await Promise.all([writeCentralNode(), writeLuzonNode(), writeVisMinNode()]);
    console.log('Central Node Write Result:', centralNodeResult[0]);
    console.log('Luzon Node Read Result:', luzonResult[0]);
    console.log('VisMin Node Read Result:', visMinResult[0]);
}

// Execute simulation
simulateConcurrentTransactions();
