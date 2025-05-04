package com.forum.authService.Repository;

import com.forum.authService.Entity.TempUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface TempUserRepository extends MongoRepository<TempUser, String> {
    Optional<TempUser> findByUserID(String userID);
}
