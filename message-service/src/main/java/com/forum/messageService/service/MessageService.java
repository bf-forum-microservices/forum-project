package com.forum.messageService.service;

import com.forum.messageService.dao.MessageDao;
import com.forum.messageService.dto.EmailEvent;
import com.forum.messageService.entity.Message;
import com.forum.messageService.entity.Message.Status;
import com.forum.messageService.exception.InvalidStatusException;
import com.forum.messageService.exception.MessageNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageDao messageDao;

    @Autowired
    private RabbitMessagePublisher rabbitMessagePublisher;

    @Transactional(readOnly = true)
    public List<Message> getAllMessages() {
        return messageDao.getAllMessages();
    }

    @Transactional(readOnly = true)
    public Message getMessageById(int id) {
        return messageDao.getMessageById(id).orElseThrow(()
                -> new MessageNotFoundException(id));
    }

    @Transactional
    public void createMessage(Message message) {
        messageDao.saveMessage(message);

        EmailEvent emailEvent = EmailEvent.builder()
                .to(message.getEmail())
                .subject("Confirmation: Message Received")
                .body("We received your message (original message below).\n\n" + message.getMessage())
                .build();

        rabbitMessagePublisher.sendMessageToQueue(emailEvent);
    }

    @Transactional
    public void deleteMessage(int id) {
        Message message = messageDao.getMessageById(id).orElseThrow(()
                -> new MessageNotFoundException(id));
        messageDao.deleteMessage(message);
    }

    @Transactional
    public void changeMessageStatus(int id, String statusString) {
        Message message = messageDao.getMessageById(id).orElseThrow(()
                -> new MessageNotFoundException(id));

        statusString = statusString.toUpperCase();
        if (statusString.equals(message.getStatus().toString())) {
            throw new InvalidStatusException(statusString, "The current status and new status are the same.");
        }

        else if (message.getStatus().toString().equals("RESOLVED")) {
            throw new InvalidStatusException(statusString, "The message has already been resolved");
        }

        else if (!statusString.equals("PROCESSED") && !statusString.equals("RESOLVED")) {
            throw new InvalidStatusException(statusString, "Allowed values are: PROCESSED, RESOLVED");
        }

        Status newStatus = Status.valueOf(statusString);

        EmailEvent emailEvent = EmailEvent.builder()
                .to(message.getEmail())
                .subject("Message Status Updated")
                .body("Your message status has changed from " +
                        message.getStatus() +
                        " -> " +
                        newStatus.toString() +
                        " (see message below).\n\n" + message.getMessage())
                .build();
        message.setStatus(newStatus);
        rabbitMessagePublisher.sendMessageToQueue(emailEvent);
    }
}
