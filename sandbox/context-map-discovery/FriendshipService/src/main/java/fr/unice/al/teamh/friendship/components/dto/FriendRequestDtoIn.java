package fr.unice.al.teamh.friendship.components.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FriendRequestDtoIn {
    private String senderId;
    private String receiverId;
}
