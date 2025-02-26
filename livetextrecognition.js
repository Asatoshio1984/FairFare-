import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function FairFare() {
  const [gasPrice, setGasPrice] = useState("");
  const [lyftPay, setLyftPay] = useState("");
  const [minWage, setMinWage] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedGasPrice = localStorage.getItem("gasPrice");
    const savedMinWage = localStorage.getItem("minWage");
    if (savedGasPrice) setGasPrice(savedGasPrice);
    if (savedMinWage) setMinWage(savedMinWage);
  }, []);

  const handleSaveDefaults = () => {
    localStorage.setItem("gasPrice", gasPrice);
    localStorage.setItem("minWage", minWage);
    alert("Default settings saved!");
  };

  const handleTextRecognition = (detectedText) => {
    const extractedPay = detectedText.match(/\$?(\d+\.\d{2})/);
    if (extractedPay) {
      setLyftPay(extractedPay[1]);
    } else {
      alert("Could not extract pay from detected text. Please enter manually.");
    }
  };

  const calculateCost = () => {
    if (!gasPrice || !lyftPay || !minWage) {
      alert("Please enter all fields.");
      return;
    }

    try {
      const mpg = 25; // Placeholder, replace with API call if needed
      const gasCostPerMile = parseFloat(gasPrice) / mpg;
      const maintenancePerMile = 0.088;
      const depreciationPerMile = 0.10;
      const totalCostPerMile = gasCostPerMile + maintenancePerMile + depreciationPerMile;
      const milesPerHour = 20; // Assume 20 mph in city driving
      const insurancePerHour = 1.15; // Estimated insurance cost
      const totalCostPerHour = totalCostPerMile * milesPerHour + insurancePerHour;
      const netEarnings = parseFloat(lyftPay) - totalCostPerHour;
      const isFair = netEarnings >= parseFloat(minWage);

      setResult({ totalCostPerHour, netEarnings, isFair });
    } catch (error) {
      console.error("Calculation Error:", error);
      alert("Error calculating data. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardContent className="p-4 space-y-4">
          <Label>Gas Price per Gallon in Anchorage ($)</Label>
          <Input type="number" value={gasPrice} onChange={(e) => setGasPrice(e.target.value)} placeholder="e.g., 4.22" />
          
          <Label>Minimum Acceptable Wage per Hour ($)</Label>
          <Input type="number" value={minWage} onChange={(e) => setMinWage(e.target.value)} placeholder="e.g., 20.00" />
          
          <Button onClick={handleSaveDefaults} className="w-full mt-2">Save Defaults</Button>
          
          <Label>Detected Ride Earnings per Hour ($)</Label>
          <Input type="number" value={lyftPay} onChange={(e) => setLyftPay(e.target.value)} placeholder="e.g., 23.00" />
          
          <Button onClick={calculateCost} className="w-full mt-4">Calculate</Button>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p><strong>Total Cost per Hour:</strong> ${result.totalCostPerHour.toFixed(2)}</p>
              <p><strong>Net Earnings per Hour:</strong> ${result.netEarnings.toFixed(2)}</p>
              <p className={result.isFair ? "text-green-500" : "text-red-500"}>
                {result.isFair ? "✅ Accept Ride" : "❌ Reject Ride"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
