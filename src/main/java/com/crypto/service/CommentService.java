package com.crypto.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crypto.dto.CommentDTO;
import com.crypto.dto.UserResponseDTO;
import com.crypto.entity.Board;
import com.crypto.entity.Comment;
import com.crypto.entity.User;
import com.crypto.exception.BoardException;
import com.crypto.repository.BoardRepository;
import com.crypto.repository.CommentRepository;
import com.crypto.repository.UserRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {
	private final CommentRepository commentRepository;
	private final BoardRepository boardRepository;
	private final UserRepository userRepository;
	
	private CommentDTO convertToDto(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setUsername(comment.getUser().getUsername());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
	
	@Transactional
	public CommentDTO createComment(Long boardId, CommentDTO commentDto, HttpSession session) {
		Board board = BoardException.validateBoard(boardRepository.findById(boardId));
		UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
		User loginuser = BoardException.validateLoginUser(userRepository.findByUsername(user.getUsername()));
		
		Comment comment = new Comment();
		comment.setContent(commentDto.getContent());
		comment.setBoard(board);
		comment.setUser(loginuser);
		
		return convertToDto(commentRepository.save(comment));
	}
	
	@Transactional
	public CommentDTO updateComment(Long id, CommentDTO commentDTO, HttpSession session) {
		Comment comment = BoardException.validateComment(commentRepository.findById(id));
		UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
		BoardException.validateUser(comment.getUser().getUsername(), user.getUsername());
		
		comment.setContent(commentDTO.getContent());;
		return convertToDto(comment);
	}
	
	@Transactional
	public void deleteComment(Long id, HttpSession session) {
		Comment comment = BoardException.validateComment(commentRepository.findById(id));
		UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
		BoardException.validateUser(comment.getUser().getUsername(), user.getUsername());
		
		commentRepository.delete(comment);
	}
}
