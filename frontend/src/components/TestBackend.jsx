import { useState } from "react";

export default function TestBackend() {

    const [status, setStatus] = useState("Not Tested");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    async function testBackend() {

        console.log("Button Clicked");

        setLoading(true);
        setStatus("Checking Backend...");
        setData(null);

        try {

            const url =
                "https://code-collaborative-platform.vercel.app/api/test/demo";

            console.log("Fetching URL:", url);

            const response = await fetch(url);

            console.log("Response:", response);

            const result = await response.json();

            console.log("Backend Response:", result);

            if (response.ok) {

                setStatus(result.message || "Backend Connected ✅");

                setData(result.data);

            }
            else {

                setStatus("Backend Error ❌");

            }

        }
        catch (err) {

            console.error("Fetch Error:", err);

            setStatus("Connection Failed ❌");

        }
        finally {

            setLoading(false);

        }

    }

    return (

        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto mt-10">

            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
                Backend Connection Test
            </h2>

            <div className="flex flex-col items-center justify-center space-y-6">

                <div
                    className={`text-xl font-medium px-4 py-2 rounded-full
                    ${status.includes("✅")
                            ? "bg-green-100 text-green-800"
                            : status.includes("❌")
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                >
                    {status}
                </div>

                <button
                    onClick={testBackend}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                    {loading ? "Testing..." : "Test Backend Connection"}
                </button>

                {data && (

                    <div className="w-full mt-8">

                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                            Response Data:
                        </h3>

                        <pre className="bg-gray-50 p-4 rounded border overflow-auto text-sm text-gray-800 max-h-64">
                            {JSON.stringify(data, null, 2)}
                        </pre>

                    </div>

                )}

            </div>

        </div>

    );

}