package com.crypto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crypto.entity.FavoritedId;
import com.crypto.entity.User;
import com.crypto.entity.UserFavorite;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, FavoritedId> {
	List<UserFavorite> findByUser(User user);
	void deleteByUserAndSymbol(User user, String symbol);
	boolean existsByUserAndSymbol(User user, String symbol);
}
