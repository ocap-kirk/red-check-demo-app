// pages/api/index.js

export default function handler(req, res) {
    res.status(200).json({
        message: "Welcome to the API",
        documentation: {
            companies: "/api/companies",
            companyDetails: "/api/companies/{companyId}",
            companyUsers: "/api/companies/{companyId}/users",
            companyAccounts: "/api/companies/{companyId}/accounts",
            accountBills: "/api/companies/{companyId}/accounts/{accountId}/bills",
            accountLines: "/api/companies/{companyId}/accounts/{accountId}/lines"
        }
    });
}
