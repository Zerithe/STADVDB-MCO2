import { Builder, By, Key } from "selenium-webdriver";


async function fillForm() {
    // Replace 'firefox' with 'chrome' if you're using Chrome
    let driver = await new Builder().forBrowser('chrome').build();
  
    try {
        // Navigate to your web application's form page
        await driver.get('http://localhost:3000/');
        

        await driver.findElement(By.id('insert')).click();
    
        // Input text into text fields
        await driver.findElement(By.name('apptid-insert')).sendKeys('123');
        await driver.findElement(By.name('pxid-insert')).sendKeys('A001');
        // ...continue with other text fields
        await driver.findElement(By.name('clinicid-insert')).sendKeys('A001');
        await driver.findElement(By.name('doctorid-insert')).sendKeys('A001');
        await driver.findElement(By.name('hospital-insert')).sendKeys('A001');
        await driver.findElement(By.name('mainspecialty-insert')).sendKeys('A001');

        
    
        // Selecting radio buttons
        await driver.findElement(By.css('input[type=radio][value="National Capital Region (NCR)"]')).click();
        await driver.findElement(By.css('input[type=radio][value="Queued"]')).click();
        // ...continue with other radio buttons as needed
    
        // Input text into date fields
        await driver.findElement(By.name('timequeued-insert')).sendKeys('01/01/2021', Key.TAB, '10:00AM');
        // ...continue with other date/time fields
        await driver.findElement(By.name('queuedate-insert')).sendKeys('01/01/2021', Key.TAB, '10:00AM');
        await driver.findElement(By.name('startime-insert')).sendKeys('01/01/2021', Key.TAB, '10:00AM');
        await driver.findElement(By.name('endtime-insert')).sendKeys('01/01/2021', Key.TAB, '10:00AM');

        await driver.findElement(By.name('type-insert')).sendKeys('A001');
        await driver.findElement(By.css('input[type=radio][value="0"]')).click();
    
        // Click on the 'Insert' button to submit the form
        await driver.findElement(By.id('submit-insert')).click(); // Make sure 'insertButton' is the correct id or use the appropriate selector
        

        // Add any additional logic you need after form submission
        // ...

    
    
    } finally {
        // It's important to quit the driver after the test execution
        await driver.quit();
    }
  }
  
  fillForm();