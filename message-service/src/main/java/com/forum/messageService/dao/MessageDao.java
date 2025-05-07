package com.forum.messageService.dao;

import com.forum.messageService.entity.Message;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import java.util.List;
import java.util.Optional;

@Repository
public class MessageDao {

    @Autowired
    private SessionFactory sessionFactory;

    private final Class<Message> clazz = Message.class;

    public List<Message> getAllMessages() {
        Session session = getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Message> criteria = builder.createQuery(clazz);
        criteria.from(clazz);
        return session.createQuery(criteria).getResultList();
    }

    public Optional<Message> getMessageById(int id) {
        return Optional.ofNullable(getCurrentSession().get(clazz, id));
    }

    public void saveMessage(Message message) {
        getCurrentSession().save(message);
    }

    public void deleteMessage(Message message) {
        getCurrentSession().delete(message);
    }

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }
}

