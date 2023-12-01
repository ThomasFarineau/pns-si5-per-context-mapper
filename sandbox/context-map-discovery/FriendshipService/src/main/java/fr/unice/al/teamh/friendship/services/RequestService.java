package fr.unice.al.teamh.friendship.services;

import fr.unice.al.teamh.friendship.components.dto.UserInfoDtoIn;
import fr.unice.al.teamh.friendship.entities.Friendship;
import fr.unice.al.teamh.friendship.entities.Request;
import fr.unice.al.teamh.friendship.exceptions.UserNotFoundException;
import fr.unice.al.teamh.friendship.repositories.FriendRepository;
import fr.unice.al.teamh.friendship.repositories.FriendRequestRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

@Service
@Slf4j
public class RequestService {
    @Autowired
    private FriendRepository friendRepository;
    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Value("${proxy.url}")
    private String proxyUrl;

    public List<Request> findAll() {
        log.info("FriendshipService: findAllRequests");
        for (Request request : friendRequestRepository.findAll()) {
            log.info(request.toString());
        }
        return friendRequestRepository.findAll();
    }

    public Request create(String senderId, String receiverId) {
        log.info("RequestService: createRequest");

        RestTemplate restTemplate = new RestTemplate();

        UserInfoDtoIn sender = restTemplate.getForObject(proxyUrl + "g/user-service/api/users/" + senderId, UserInfoDtoIn.class);
        UserInfoDtoIn receiver = restTemplate.getForObject(proxyUrl + "g/user-service/api/users/" + receiverId, UserInfoDtoIn.class);

        if (sender == null) throw new UserNotFoundException(senderId);
        if (receiver == null) throw new UserNotFoundException(receiverId);

        Optional<Request> existingRequest = Optional.ofNullable(friendRequestRepository.findBySenderAndReceiver(receiver.getId(), sender.getId()));

        if (existingRequest.isPresent()) {
            createFriendship(sender.getId(), receiver.getId());
            friendRequestRepository.delete(existingRequest.get());
            return null;
        }

        return createAndSaveFriendRequest(sender.getId(), receiver.getId());
    }

    private void createFriendship(String user1, String user2) {
        Friendship friendship = new Friendship();
        friendship.setUsers(Set.of(user1, user2));
        friendRepository.save(friendship);
    }

    private Request createAndSaveFriendRequest(String sender, String receiver) {
        Request request = new Request();
        request.setSender(sender);
        request.setReceiver(receiver);
        return friendRequestRepository.save(request);
    }

    public List<Request> get(String id) {
        log.info("RequestService: getRequests");

        RestTemplate restTemplate = new RestTemplate();
        UserInfoDtoIn userInfo = restTemplate.getForObject(proxyUrl + "g/user-service/api/users/" + id, UserInfoDtoIn.class);
        if (userInfo == null) throw new UserNotFoundException(id);

        return Stream.of(friendRequestRepository.findAllBySender(userInfo.getId()), friendRequestRepository.findAllByReceiver(userInfo.getId())).flatMap(List::stream).toList();
    }
}
