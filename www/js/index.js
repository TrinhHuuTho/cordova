/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);

  const form = document.getElementById("dataForm");
  const responseMessage = document.getElementById("responseMessage");
  const thankYouMessage = document.getElementById("thankYouMessage");
  const submitAnotherButton = document.getElementById("submitAnother");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const formData = {
      name: name,
      email: email,
      message: message,
    };

    // Replace with your actual backend IP address
    const apiUrl = "ccz/api/forms";

    responseMessage.textContent = ""; // Clear previous messages
    thankYouMessage.style.display = "none"; // Hide thank you message initially

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          // Try to get error detail from backend response
          return response
            .json()
            .then((err) => {
              throw new Error(
                err.detail || `HTTP error! status: ${response.status}`
              );
            })
            .catch(() => {
              // Fallback if response is not JSON or has no detail
              throw new Error(`HTTP error! status: ${response.status}`);
            });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        form.style.display = "none"; // Hide the form
        thankYouMessage.style.display = "block"; // Show thank you message
        form.reset(); // Clear the form fields
      })
      .catch((error) => {
        console.error("Error:", error);
        responseMessage.textContent = `Error submitting form: ${error.message}`;
      });
  });

  submitAnotherButton.addEventListener("click", function () {
    thankYouMessage.style.display = "none"; // Hide thank you message
    responseMessage.textContent = ""; // Clear any error messages
    form.style.display = "block"; // Show the form again
  });
}
