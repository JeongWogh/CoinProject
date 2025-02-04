package com.crypto.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crypto.dto.BoardDTO;
import com.crypto.dto.CommentDTO;
import com.crypto.dto.UserResponseDTO;
import com.crypto.entity.Board;
import com.crypto.entity.User;
import com.crypto.exception.BoardException;
import com.crypto.repository.BoardRepository;
import com.crypto.repository.UserRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {
   private final UserRepository userRepository;
   private final BoardRepository boardRepository;
   
   private BoardDTO convertToDto(Board board, HttpSession session) {
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
       System.out.println("Session User: " + (user != null ? user.getUsername() : "null"));
       System.out.println("Board User: " + board.getUser().getUsername());
       BoardDTO dto = new BoardDTO();
       dto.setId(board.getId());
       dto.setTitle(board.getTitle());
       dto.setContent(board.getContent());
       dto.setUsername(board.getUser().getUsername());
       dto.setViewCount(board.getViewCount());
       dto.setLikeCount(board.getLikeCount());
       dto.setCreatedAt(board.getCreatedAt());
       dto.setAuthor(user != null && user.getUsername().equals(board.getUser().getUsername()));
       
       dto.setComments(
           board.getComments().stream()
           .map(comment -> {
               CommentDTO commentDto = new CommentDTO();
               commentDto.setId(comment.getId());
               commentDto.setContent(comment.getContent());
               commentDto.setUsername(comment.getUser().getUsername());
               commentDto.setCreatedAt(comment.getCreatedAt());
               commentDto.setAuthor(user != null && user.getUsername().equals(comment.getUser().getUsername()));
               return commentDto;
           })
           .collect(Collectors.toList())
       );
       return dto;
   }
   
   @Transactional
   public BoardDTO createBoard(BoardDTO boardDto, HttpSession session) {
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
       User loginuser = BoardException.validateLoginUser(userRepository.findByUsername(user.getUsername()));
       
       Board board = new Board();
       board.setTitle(boardDto.getTitle());
       board.setContent(boardDto.getContent());
       board.setUser(loginuser);
       
       return convertToDto(boardRepository.save(board), session);
   }
   
   @Transactional
   public BoardDTO getBoard(Long id, HttpSession session) {
       Board board = boardRepository.findById(id)
               .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
       
       board.setViewCount(board.getViewCount() + 1);
       
       return convertToDto(board, session);
   }
   
   public List<BoardDTO> getAllBoards(HttpSession session) {
       return boardRepository.findAllByOrderByCreatedAtDesc().stream()
               .map(board -> convertToDto(board, session))
               .collect(Collectors.toList());
   }
   
   @Transactional
   public BoardDTO updateBoard(Long id, BoardDTO boardDTO, HttpSession session) {
       Board board = BoardException.validateBoard(boardRepository.findById(id));
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");        
       BoardException.validateUser(board.getUser().getUsername(), user.getUsername());
       
       board.setTitle(boardDTO.getTitle());
       board.setContent(boardDTO.getContent());
       return convertToDto(board, session);
   }
   
   @Transactional
   public void deleteBoard(Long id, HttpSession session) {
       Board board = BoardException.validateBoard(boardRepository.findById(id));
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");        
       BoardException.validateUser(board.getUser().getUsername(), user.getUsername());
       
       boardRepository.delete(board);
   }
   
   @Transactional
   public void likeBoard(Long id, HttpSession session) {
       Board board = boardRepository.findById(id)
               .orElseThrow(() -> new RuntimeException("게시글이 없습니다."));
       
       UserResponseDTO user = (UserResponseDTO) session.getAttribute("LOGGED_IN_USER");
       
       if(board.hasUserLiked(user.getUserId())) {
           throw new RuntimeException("이미 추천하셨습니다.");
       }
       
       board.addLike(user.getUserId());
   }
}