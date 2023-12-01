package fr.unice.al.teamh.friendship.controllers;

import fr.unice.al.teamh.friendship.components.dto.FriendRequestDtoIn;
import fr.unice.al.teamh.friendship.entities.Request;
import fr.unice.al.teamh.friendship.services.RequestService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
@Tag(name = "Requests")
public class RequestController {
    private final RequestService requestService;

    private RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping("")
    public Iterable<Request> getRequests() {
        return requestService.findAll();
    }

    @PostMapping("")
    public void request(@RequestBody FriendRequestDtoIn friendRequestDtoIn) {
        requestService.create(friendRequestDtoIn.getSenderId(), friendRequestDtoIn.getReceiverId());
    }

    @GetMapping("/{id}")
    public Iterable<Request> getRequests(@PathVariable String id) {
        return requestService.get(id);
    }
}
