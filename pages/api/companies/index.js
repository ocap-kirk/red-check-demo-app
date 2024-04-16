// pages/api/companies/index.js
import fs from 'fs';
import path from 'path';
import { json } from 'stream/consumers';

// Define the path to data.json relative to the root of the project
const dataFilePath = path.join(process.cwd(), 'data.json');
console.log(process.cwd());
export default function handler(req, res) {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error accessing data' });
        }
        let jsonData = JSON.parse(data);

        switch (req.method) {
            case 'GET':
                // Return all companies
                console.log(jsonData.companies);
                res.status(200).json(jsonData.companies);
                break;
            case 'POST':
                // Add a new company
                const newCompany = { id: jsonData.companies.length + 1, ...req.body };
                jsonData.companies.push(newCompany);
                fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), err => {
                    if (err) {
                        return res.status(500).json({ message: 'Error saving data' });
                    }
                    res.status(201).json(newCompany);
                });
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
