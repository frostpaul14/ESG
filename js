document.addEventListener("DOMContentLoaded", function () {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGkJna8Mf7T0cZY5W7QK10eNoO8V3ymNa9vVz8SpLkOfybRfoin__LIXs4yJLtSuhoK5JjEktymVGQ/pub?output=csv";
    const industryFilter = document.getElementById("industryFilter");
    const companyGrid = document.getElementById("companyGrid");
    const sidebar = document.getElementById("sidebar");

    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").slice(1);
            const companies = rows.map(row => {
                const cols = row.split(",");
                return {
                    id: cols[0].trim(),
                    company: cols[1].trim(),
                    industry: cols[2].trim(),
                    socialObjective: cols[3].trim(),
                    charitableAreas: cols[4].trim(),
                    foundationOpen: cols[5].trim(),
                    contactAvailable: cols[6].trim(),
                    logo: cols[7].trim()
                };
            });

            displayCompanies(companies);
            populateIndustryFilter(companies);
        })
        .catch(error => console.error("Error loading CSV:", error));

    function displayCompanies(companies) {
        companyGrid.innerHTML = "";

        companies.forEach(company => {
            const card = document.createElement("div");
            card.classList.add("card");

            const img = document.createElement("img");
            img.src = company.logo;
            img.alt = company.company;

            card.appendChild(img);
            card.addEventListener("click", () => showCompanyDetails(company));
            companyGrid.appendChild(card);
        });
    }

    function showCompanyDetails(company) {
        sidebar.innerHTML = `
            <h2>${company.company}</h2>
            <p><strong>Industry:</strong> ${company.industry}</p>
            <p><strong>Social Objective:</strong> ${company.socialObjective}</p>
            <p><strong>Primary Charitable Areas:</strong> ${company.charitableAreas}</p>
            <p><strong>Foundation Open:</strong> ${company.foundationOpen}</p>
            <p><strong>Contact Available:</strong> ${company.contactAvailable}</p>
        `;
    }

    function populateIndustryFilter(companies) {
        const industries = ["All", ...new Set(companies.map(c => c.industry))];
        industries.forEach(industry => {
            const option = document.createElement("option");
            option.value = industry;
            option.textContent = industry;
            industryFilter.appendChild(option);
        });

        industryFilter.addEventListener("change", () => {
            const selected = industryFilter.value;
            const filtered = selected === "All"
                ? companies
                : companies.filter(c => c.industry === selected);
            displayCompanies(filtered);
        });
    }
});
