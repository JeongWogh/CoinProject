package com.coin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PasswordChangeDTO {
	private String postPassword;
	private String newPassword;
}
