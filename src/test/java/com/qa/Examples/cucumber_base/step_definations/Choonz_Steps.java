package com.qa.Examples.cucumber_base.step_definations;

import static org.junit.Assert.assertEquals;

import org.openqa.selenium.WebDriver;

import com.qa.Examples.cucumber_base.hooks.Hooks;
import com.qa.Examples.cucumber_base.pages.ChoonzPOMRepository;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class Choonz_Steps {

	private ChoonzPOMRepository pom;
	private WebDriver webDriver;
	// final public static String URL = "https://www.saucedemo.com/";
	private boolean accountExpected;
	private boolean accountActual;

	public Choonz_Steps(Hooks hooks) {
		this.webDriver = hooks.getWebDriver();
		this.pom = new ChoonzPOMRepository(webDriver);
		this.accountExpected = true;
	}

	@Given("the user is on the Landing page")
	public void the_user_is_on_the_landing_page() throws InterruptedException {
		Thread.sleep(10000);
		webDriver.get(pom.landingPage.URL);
		// pom.landingPage.clickLogout();
		Thread.sleep(10000);
		// throw new io.cucumber.java.PendingException();
	}

	@When("the user clicked logout button")
	public void the_user_clicked_logout_button() throws InterruptedException {
		Thread.sleep(10000);
		pom.landingPage.clicksingupbutton();
		Thread.sleep(10000);
		// throw new io.cucumber.java.PendingException();
	}

	@When("the user try to sing up with username {word},pasword {word} and confirmation password {word}")
	public void the_user_try_to_sing_up(String username, String password, String confpassword)
			throws InterruptedException {
		pom.singuppage.fillsignupdetail(username, password, confpassword);
		Thread.sleep(10000);
		// throw new io.cucumber.java.PendingException();
	}

	@Then("the user is singed up")
	public void the_user_is_singed_up() throws InterruptedException {
		accountActual = pom.singuppage.singupcompleted();

		System.out.println(pom.singuppage.getwelcomenote().getText());
		assertEquals(accountExpected, accountActual);
		

	}

	@Given("the user is on the Login page")
	public void theUserIsOnTheLoginPage() throws InterruptedException {
		Thread.sleep(5000);
		webDriver.get(pom.loginpage.URL);
//		 pom.loginpage.clickLogout();
//		 Thread.sleep(5000);
		pom.loginpage.clicksingin();
		Thread.sleep(5000);
	}

	@When("the user try to sing in with username {word} and password {word}")
	public void theUserTryToSingInWithUsernameMatiAndPasswordMati123(String username, String password)
			throws InterruptedException {
//		pom.singuppage.clicklogout();
//		Thread.sleep(5000);
//		pom.singuppage.clicksingin();
//		Thread.sleep(5000);
		pom.loginpage.filllogindetail(username, password);
		Thread.sleep(10000);
	}

	@Then("the user is signined in")
	public void theUserIsSigninedIn() throws InterruptedException {
		Thread.sleep(5000);
		accountActual = pom.loginpage.signincompleted();

		System.out.println(pom.loginpage.getwelcomenote().getText());
		assertEquals(accountExpected, accountActual);
	}

}
