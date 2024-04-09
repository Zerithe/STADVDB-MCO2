// This is to simulate for Case 1: Concurrent transactions in two or more nodes are reading the same data item.

import { centralNodeConnection, luzonNodeConnection } from './DBConn.js'; // Import database connections from DBConn.js

// Function to simulate concurrent read transactions in central node
async function readCentralNode() {
    try {
        const transaction = await centralNodeConnection.transaction(); // Start transaction in central node
        const result = await centralNodeConnection.query('SELECT * FROM appointments WHERE apptid = ?', {
            replacements: ['0000F35265B8C5913394D60B048D0763'],
            transaction // Pass transaction object to query
        });
        await transaction.commit(); // Commit transaction
        return result; // Return the result instead of logging
    } catch (error) {
        console.error('Error reading from central node:', error);
        throw error; // Rethrow the error
    }
}

// Function to simulate concurrent read transactions in Luzon node
async function readLuzonNode() {
    try {
        const transaction = await luzonNodeConnection.transaction(); // Start transaction in Luzon node
        const result = await luzonNodeConnection.query('SELECT * FROM appointments WHERE apptid = ?', {
            replacements: ['0000F35265B8C5913394D60B048D0763'],
            transaction // Pass transaction object to query
        });
        await transaction.commit(); // Commit transaction
        return result; // Return the result instead of logging
    } catch (error) {
        console.error('Error reading from Luzon node:', error);
        throw error; // Rethrow the error
    }
}


// Simulate concurrent read transactions in all nodes
async function simulateConcurrentReads() {
    const [centralNodeResult, luzonNodeResult] = await Promise.all([readCentralNode(), readLuzonNode()]);
    console.log('Central Node Result:', centralNodeResult[0]);
    console.log('Luzon Node Result:', luzonNodeResult[0]);
}

// Execute simulation
simulateConcurrentReads();
