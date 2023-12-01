package fr.unice.al.teamh.friendship.services;

import fr.unice.al.teamh.friendship.components.dto.UserInfoDtoIn;
import fr.unice.al.teamh.friendship.entities.Friendship;
import fr.unice.al.teamh.friendship.repositories.FriendRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class FriendshipService {
    @Autowired
    private FriendRepository friendRepository;

    @Value("${proxy.url}")
    private String proxyUrl;

    public List<Friendship> findAll() {
        log.info("FriendshipService: findAll");
        return friendRepository.findAll();
    }

    public List<String> friendFriendsOf(String id) {
        log.info("FriendshipService: findAllOf");

        RestTemplate restTemplate = new RestTemplate();
        UserInfoDtoIn userInfoDto = restTemplate.getForObject(proxyUrl + "g/user-service/api/users/" + id, UserInfoDtoIn.class);

        if (userInfoDto == null) {
            return Collections.emptyList();
        }

        return friendRepository.findAllByUserId(userInfoDto.getId()).stream().flatMap(friendship -> friendship.getUsers().stream()).filter(friendId -> !friendId.equals(id)).toList();
    }

    public boolean check(String id1, String id2) {
        log.info("FriendshipService: check");
        return friendRepository.findByUsers(id1, id2) != null;
    }
}
