package com.amdinstallation.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.amdinstallation.web.config.MongoProperties;
import com.amdinstallation.web.model.User;

@RestController
@RequestMapping("/api/v1/login")
public class LoginController {
	
	@Autowired
	private MongoProperties settings;
	
	@PostMapping("/users")
	public @ResponseStatus(HttpStatus.OK) User login(@RequestBody User user) {
		if (user.getUsername().equals(settings.getUser()) && user.getPassword().equals(settings.getPassword())) {
			User u = new User();
			u.setUsername(user.getUsername());
			return u;
		}
		throw new UnauthorizedException();
	}

}
