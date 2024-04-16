// pages/api/companies/[companyId].js
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
    const { companyId } = req.query;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error accessing data' });
        }
        const jsonData = JSON.parse(data);
        const company = jsonData.companies.find(c => c.companyId === companyId);
        console.log(jsonData.companies);
        switch (req.method) {
            case 'GET':
                if (company) {
                    res.status(200).json(company);
                } else {
                    res.status(404).json({ message: "Company not found" });
                }
                break;
            case 'PUT':
                if (company) {
                    const index = jsonData.companies.indexOf(company);
                    jsonData.companies[index] = { ...company, ...req.body };
                    fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), err => {
                        if (err) {
                            return res.status(500).json({ message: 'Error updating data' });
                        }
                        res.status(200).json(jsonData.companies[index]);
                    });
                } else {
                    res.status(404).json({ message: "Company not found" });
                }
                break;
            case 'DELETE':
                if (company) {
                    jsonData.companies = jsonData.companies.filter(c => c.id !== companyId);
                    fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), err => {
                        if (err) {
                            return res.status(500).json({ message: 'Error deleting data' });
                        }
                        res.status(204).send();
                    });
                } else {
                    res.status(404).json({ message: "Company not found" });
                }
                break;
            default:
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
