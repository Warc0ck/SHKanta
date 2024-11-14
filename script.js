document.getElementById('startButton').addEventListener('click', async () => {
    const kehysFile = document.getElementById('kehysFile').files[0];
    const asiakirjaFile = document.getElementById('asiakirjaFile').files[0];

    if (!kehysFile || !asiakirjaFile) {
        alert("Valitse molemmat XML-tiedostot!");
        return;
    }

    try {
        const kehysXml = await kehysFile.text();
        const asiakirjaXml = await asiakirjaFile.text();

        console.log("Kehys XML:", kehysXml);
        console.log("Asiakirja XML:", asiakirjaXml);

        // API endpoint with CORS proxy
        const proxyUrl = 'http://shvalidaattori.at.kanta.fi/shark-validointi/validoi/asiakirja/tulos';

        // XML parsing for reasonCode
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kehysXml, "application/xml");
        const reasonCodeElement = xmlDoc.querySelector('controlActProcess reasonCode');

        console.log("Reason Code Element:", reasonCodeElement);

        const reasonCode = reasonCodeElement ? reasonCodeElement.getAttribute('code') : null;

        if (!reasonCode) {
            alert("Palvelupyyntö koodia ei löydy!");
            return;
        }

        console.log("Reason Code:", reasonCode);

        // Data to be sent
        const data = {
            "messageId": "1234567890",
            "palveluPyynto": reasonCode,
            "level": "1",
            "siirtokehysXml": kehysXml,
            "asiakirjaXml": asiakirjaXml
        };

        console.log("Data to be sent:", data);

        // Sending POST request
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error in request: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Response Data:", responseData);
        document.getElementById('output').innerText = JSON.stringify(responseData, null, 4);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
});
