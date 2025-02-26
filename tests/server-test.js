let passedCount = 0;
let failedCount = 0;

function logSuccess(message) {
  console.log(`${message}`);
  passedCount++;
}

function logFailure(message) {
  console.error(`${message}`);
  failedCount++;
}

async function testFetchRoot() {
  console.log("\nTesting localhost 3000 up...");
  try {

    const res = fetch("http://localhost:3000/", {
        method: "GET",
    });

    logSuccess("test passed");
  } catch (error) {
    logFailure(
      "basic fetch did not handle URL gracefully: " + error
    );
  }
}

async function testFunctionalRootAPI() {
    console.log("\nTesting localhost 3000 up...");
    try {
  
      const res = fetch("http://localhost:3000/api/", {
          method: "GET",
      });
  
      logSuccess("test passed");
    } catch (error) {
      logFailure(
        "basic fetch did not handle URL gracefully: " + error
      );
    }
  }


async function testResponseAPIPosts() {
  console.log("\nTesting localhost 3000 up...");
  try {

    const res = fetch("http://localhost:3000/api/articles", {
        method: "GET",
    });

    logSuccess("test passed");
  } catch (error) {
    logFailure(
      "basic fetch did not handle URL gracefully: " + error
    );
  }
}

// Run all tests
async function runTests() {
  await testFetchRoot();
  await testFunctionalRootAPI();

  console.log("\nTest results:");
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);

  if (failedCount === 0) {
    console.log(`All passed!`);
  }
}
