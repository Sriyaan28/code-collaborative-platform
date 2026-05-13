import { useState } from "react";

export default function TestBackend() {

    const [status, setStatus] = useState("Not Tested");

    async function testBackend() {

        console.log("Button clicked");

        setStatus("Checking Backend...");
        try {

            const url = "https://code-collaborative-platform.vercel.app/api/test/demo";

            console.log("Fetching from:", url);

            const response = await fetch(url);

            console.log("Raw Response:", response);

            const data = await response.json();

            console.log("JSON Data:", data);

            if (response.ok) {

                setStatus("Backend Connected ✅");

            }
            else {

                setStatus("Backend Error ❌");

            }

        }
        catch (err) {

            console.log("Fetch Error:", err);

            setStatus("Connection Failed ❌");

        }

    }

    return (

        <div style={{ padding: "20px" }}>

            <h1>{status}</h1>

            <button onClick={testBackend}>
                Test Backend
            </button>

        </div>

    );

}