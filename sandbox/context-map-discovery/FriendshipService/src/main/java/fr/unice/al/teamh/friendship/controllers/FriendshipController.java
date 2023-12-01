package fr.unice.al.teamh.friendship.controllers;

import fr.unice.al.teamh.friendship.components.dto.CheckFriendDtoIn;
import fr.unice.al.teamh.friendship.entities.Friendship;
import fr.unice.al.teamh.friendship.services.FriendshipService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/friendships")
@Tag(name = "Friendships")
public class FriendshipController {
    @Autowired
    private FriendshipService friendshipService;

    @GetMapping
    public Iterable<Friendship> get() {
        return friendshipService.findAll();
    }

    @GetMapping("/{id}")
    public Iterable<String> get(@PathVariable String id) {
        return friendshipService.friendFriendsOf(id);
    }

    @PostMapping("/check")
    public boolean areFriends(@RequestBody CheckFriendDtoIn ids) {
        return friendshipService.check(ids.getUser1Id(), ids.getUser2Id());
    }
}
