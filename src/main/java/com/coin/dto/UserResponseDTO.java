package com.coin.dto;

import lombok.Getter;
import lombok.Setter;
import com.coin.entity.User;

@Getter
@Setter
public class UserResponseDTO {
    private Long userId;
    private String username;
    private String email;
    private String style;

    public static UserResponseDTO from(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setStyle(user.getStyle());
        return dto;
    }
}