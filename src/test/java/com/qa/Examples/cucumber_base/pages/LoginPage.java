package com.qa.Examples.cucumber_base.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class LoginPage {
	final public String URL = "http://localhost:8082";

	@FindBy(id = "username")
	private WebElement usernameinputfield;

	@FindBy(id = "password")
	private WebElement passwordInputField;

	@FindBy(id = "submit")
	private WebElement submitbutton;

	@FindBy(xpath = "//*[@id=\"logarea\"]/a")
	private WebElement logoutbutton;

	@FindBy(xpath = "/html/body/div[1]/h2")
	private WebElement welcomenote;

	@FindBy(xpath = "//*[@id=\"logarea\"]/a[1]")
	private WebElement signinbutton;

	public void filllogindetail(String username, String password) throws InterruptedException {
		usernameinputfield.sendKeys(username);
		passwordInputField.sendKeys(password);

		submitbutton.click();
	}

	public WebElement getwelcomenote() {
		return welcomenote;
	}

	public void clicksingin() {
		signinbutton.click();
	}

	public void clickLogout() throws InterruptedException {

		logoutbutton.click();
	}

	public boolean signincompleted() {
		if (welcomenote != null) {
			if (welcomenote.getText().equals("Welcome to Choonz")) {
				return true;
			}
		}
		return false;
	}

}
