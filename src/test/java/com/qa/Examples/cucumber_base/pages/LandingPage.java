package com.qa.Examples.cucumber_base.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class LandingPage {
	//final public String URL = "http://localhost:8082/login.html";
	final public String URL = "http://localhost:8082";
	@FindBy(xpath = "//*[@id=\"logarea\"]/a")
	private WebElement logoutbutton;

	@FindBy(xpath = "//a[text()='Sign Up']")
	//@FindBy(xpath = "/html/body/div/div/a")

	private WebElement signupbutton;
	
	public void clickLogout() throws InterruptedException {

		logoutbutton.click();
	}

	public void clicksingupbutton() throws InterruptedException {

		signupbutton.click();
	}

}
