package fr.unice.al.teamh.friendtransaction.services;

import fr.unice.al.teamh.friendtransaction.components.dto.*;
import fr.unice.al.teamh.friendtransaction.exceptions.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class FriendTransactionService {

    @Value("${proxy.url}")
    private String proxyUrl;

    public boolean createFriendTransaction(TransactionDtoIn transactionDto) {
        if (areFriends(transactionDto.getSender(), transactionDto.getReceiver())) {
            RestTemplate restTemplate = new RestTemplate();
            UserInfoDto sender = restTemplate.getForObject(proxyUrl + "g/user-service/api/users/" + transactionDto.getSender(), UserInfoDto.class);
            UserInfoDto receiver = restTemplate.getForObject(proxyUrl + "g/user-service/api/users/" + transactionDto.getReceiver(), UserInfoDto.class);
            TransactionDto transactionToSend = new TransactionDto();
            if (sender == null) {
                throw new UserNotFoundException(transactionDto.getSender());
            } else if (receiver == null) {
                throw new UserNotFoundException(transactionDto.getReceiver());
            }
            transactionToSend.setSender(sender.getAccount());
            transactionToSend.setReceiver(receiver.getAccount());
            transactionToSend.setAmount(transactionDto.getAmount());
            transactionToSend.setType(TransactionType.INTERNAL_ACCOUNT_TO_ACCOUNT.toString());
            try {
                Boolean result = restTemplate.postForObject(proxyUrl + "g/transaction-service/api/transactions", transactionToSend, Boolean.class);
                return Boolean.TRUE.equals(result);
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

    public boolean areFriends(String user1Id, String user2Id) {
        RestTemplate restTemplate = new RestTemplate();
        CheckFriendDtoIn checkFriendDtoIn = new CheckFriendDtoIn();
        checkFriendDtoIn.setUser1Id(user1Id);
        checkFriendDtoIn.setUser2Id(user2Id);
        Boolean friends = restTemplate.postForObject(proxyUrl + "g/friendship-service/api/friendships/check", checkFriendDtoIn, Boolean.class);
        return Boolean.TRUE.equals(friends);
    }
}