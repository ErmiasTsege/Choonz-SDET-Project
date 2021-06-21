package com.qa.Examples.cucumber_base.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class SignupPage {

	@FindBy(id = "username")
	private WebElement usernameinputfield;

	@FindBy(id = "password")
	private WebElement passwordInputField;

	@FindBy(id = "confpassword")
	private WebElement confpasswordInputField;
	@FindBy(id = "submit")
	private WebElement submitbutton;
	@FindBy(xpath = "//*[@id=\"logarea\"]/a")
	
	private WebElement logutbutton;
	@FindBy(xpath = "// *[@id=\"logarea\"]/a[1]")
	private WebElement signinbutton;

	public void fillsignupdetail(String useremail, String password,String confpassword) throws InterruptedException {
		usernameinputfield.sendKeys(useremail);
		passwordInputField.sendKeys(password);
		confpasswordInputField.sendKeys(confpassword);
		submitbutton.click();
	}

	@FindBy(xpath = "/html/body/div[1]/h2")
	private WebElement welcomenote;

	public WebElement getwelcomenote() {
		return welcomenote;
	}

	public void clicksingin() {
		signinbutton.click();
	}

	public void clicklogout() {
		logutbutton.click();
	}
	public boolean singupcompleted() {
		if (welcomenote != null) {
			if (welcomenote.getText().equals("Welcome to Choonz")) {
				return true;
			}
		}
		return false;
	}

}
