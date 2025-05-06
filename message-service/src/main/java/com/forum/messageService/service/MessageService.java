package com.forum.messageService.service;

import com.forum.messageService.dao.MessageDao;
import com.forum.messageService.dto.MessageRequest;
import com.forum.messageService.entity.Message;
import com.forum.messageService.entity.Message.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageDao messageDao;

    @Transactional(readOnly = true)
    public List<Message> getAllMessages() {
        return messageDao.getAllMessages();
    }

    @Transactional(readOnly = true)
    public Message getMessageById(int id) {
        return messageDao.getMessageById(id);
    }

    @Transactional
    public void createMessage(Message message) {
        messageDao.saveMessage(message);
    }

    @Transactional
    public void deleteMessage(int id) {
        Message message = messageDao.getMessageById(id);
        if (message != null) {
            messageDao.deleteMessage(message);
        }
    }

    @Transactional
    public void changeMessageStatus(int id, Status newStatus) {
        Message message = messageDao.getMessageById(id);
        if (message != null) {
            message.setStatus(newStatus);
        }
    }
}
