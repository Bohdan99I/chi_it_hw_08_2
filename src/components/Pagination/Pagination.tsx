import React from 'react';
import { Pagination as MUIPagination, Box } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  return (
    <Box display="flex" justifyContent="center" mt={4} mb={4}>
      <MUIPagination 
        count={totalPages} 
        page={currentPage} 
        onChange={handleChange}
        color="primary"
        size="large"
      />
    </Box>
  );
};
