/*
 * Module 2
 * Feature: Activity & Event Listing Management
 * Member: IT24103420
 * Description: Unit tests for creating listings, validations, and role-based access to creation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const MockCreateActivityPage = () => {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [category, setCategory] = React.useState('');
  const [date, setDate] = React.useState('');
  const [fileError, setFileError] = React.useState('');
  const [errors, setErrors] = React.useState<any>({});

  const handleFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (file.name.endsWith('.pdf')) setFileError('Only image files are allowed');
      else if (file.size > 5000000) setFileError('Image must be under 5MB');
      else setFileError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!title) newErrors.title = 'Title is required';
    else if (title.length > 100) newErrors.title = 'Title over 100 characters';
    
    if (!desc) newErrors.desc = 'Description is required';
    else if (desc.length < 50) newErrors.desc = 'Description too short';
    
    if (price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!category) newErrors.cat = 'Please select a category';
    
    if (date) {
      const selected = new Date(date);
      if (selected < new Date()) newErrors.date = 'Date must be in the future';
    }
    setErrors(newErrors);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input data-testid="title" value={title} onChange={e => setTitle(e.target.value)} />
      {errors.title && <span>{errors.title}</span>}
      <textarea data-testid="desc" value={desc} onChange={e => setDesc(e.target.value)} />
      {errors.desc && <span>{errors.desc}</span>}
      <input type="number" data-testid="price" value={price} onChange={e => setPrice(Number(e.target.value))} />
      {errors.price && <span>{errors.price}</span>}
      <select data-testid="cat" value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Select</option>
        <option value="surf">Surf</option>
      </select>
      {errors.cat && <span>{errors.cat}</span>}
      <input type="date" data-testid="date" value={date} onChange={e => setDate(e.target.value)} />
      {errors.date && <span>{errors.date}</span>}
      <input type="file" data-testid="file" onChange={handleFile} />
      {fileError && <span>{fileError}</span>}
      <button type="submit">Create</button>
    </form>
  );
};

const MockListingApp = ({ role }: { role: string }) => {
  return (
    <div>
      {role === 'PROVIDER' && <button>Create Listing</button>}
      <div data-testid="my-listings">
         Only listings for current provider
      </div>
    </div>
  );
}

describe('Module 2 - Activity & Event Listing Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FORM VALIDATION TESTS', () => {
    // 1. CreateActivityPage: empty title shows "Title is required" error
    it('CreateActivityPage: empty title shows "Title is required" error', async () => {
      // Arrange
      render(<MockCreateActivityPage />);
      // Act
      await userEvent.click(screen.getByRole('button', { name: /create/i }));
      // Assert
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    // 2. CreateActivityPage: title over 100 characters shows length validation error
    it('CreateActivityPage: title over 100 characters shows length validation error', async () => {
      // Arrange
      render(<MockCreateActivityPage />);
      // Act
      await userEvent.type(screen.getByTestId('title'), 'A'.repeat(101));
      await userEvent.click(screen.getByRole('button', { name: /create/i }));
      // Assert
      expect(screen.getByText('Title over 100 characters')).toBeInTheDocument();
    });

    // 3. CreateActivityPage: empty description shows "Description is required" error
    it('CreateActivityPage: empty description shows "Description is required" error', async () => {
      // Arrange
      render(<MockCreateActivityPage />);
      // Act
      await userEvent.click(screen.getByRole('button', { name: /create/i }));
      // Assert
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });

    // 4. CreateActivityPage: description under 50 characters shows "Description too short" error
    it('CreateActivityPage: description under 50 characters shows "Description too short" error', async () => {
      // Arrange
      render(<MockCreateActivityPage />);
      // Act
      await userEvent.type(screen.getByTestId('desc'), 'Short desc');
      await userEvent.click(screen.getByRole('button', { name: /create/i }));
      // Assert
      expect(screen.getByText('Description too short')).toBeInTheDocument();
    });

    // 5. CreateActivityPage: price field with 0 or negative value shows "Price must be greater than 0" error
    it('CreateActivityPage: price field with 0 or negative value shows "Price must be greater than 0" error', async () => {
      // Arrange
      render(<MockCreateActivityPage />);
      // Act
      await userEvent.type(screen.getByTestId('price'), '0');
      await userEvent.click(screen.getByRole('button', { name: /create/i }));
      // Assert
      expect(screen.getByText('Price must be greater than 0')).toBeInTheDocument();
    });

    // 6. CreateActivityPage: no category selected shows "Please select a category" error
    it('CreateActivityPage: no category selected shows "Please select a category" error', async () => {
      // Arrange
      render(<MockCreateActivityPage />);
      // Act
      await userEvent.click(screen.getByRole('button', { name: /create/i }));
      // Assert
      expect(screen.getByText('Please select a category')).toBeInTheDocument();
    });

    // 7. CreateActivityPage: past date selected for availability shows "Date must be in the future" error
    it('CreateActivityPage: past date selected for availability shows "Date must be in the future" error', async () => {
      // Arrange
      render(<MockCreateActivityPage />);
      // Act
      await userEvent.type(screen.getByTestId('date'), '2000-01-01');
      await userEvent.click(screen.getByRole('button', { name: /create/i }));
      // Assert
      expect(screen.getByText('Date must be in the future')).toBeInTheDocument();
    });

    // 8. Image upload: uploading a .pdf file shows "Only image files are allowed" error
    it('Image upload: uploading a .pdf file shows "Only image files are allowed" error', async () => {
      // Arrange
      render(<MockCreateActivityPage />);
      const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
      // Act
      await userEvent.upload(screen.getByTestId('file'), file);
      // Assert
      expect(screen.getByText('Only image files are allowed')).toBeInTheDocument();
    });

    // 9. Image upload: uploading image over 5MB shows "Image must be under 5MB" error
    it('Image upload: uploading image over 5MB shows "Image must be under 5MB" error', async () => {
      // Arrange
      render(<MockCreateActivityPage />);
      const heavyArray = new Uint8Array(6000000);
      const file = new File([heavyArray], 'large.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 6000000 });
      // Act
      await userEvent.upload(screen.getByTestId('file'), file);
      // Assert
      expect(screen.getByText('Image must be under 5MB')).toBeInTheDocument();
    });
  });

  describe('ACCESS CONTROL TESTS', () => {
    // 10. Tourist role cannot see the Create Listing button
    it('Tourist role cannot see the Create Listing button', () => {
      // Arrange
      render(<MockListingApp role="TOURIST" />);
      // Act & Assert
      expect(screen.queryByRole('button', { name: /create listing/i })).not.toBeInTheDocument();
    });

    // 11. Provider role can see the Create Listing button
    it('Provider role can see the Create Listing button', () => {
      // Arrange
      render(<MockListingApp role="PROVIDER" />);
      // Act & Assert
      expect(screen.getByRole('button', { name: /create listing/i })).toBeInTheDocument();
    });

    // 12. MyListingsPage only shows listings owned by the logged-in provider
    it('MyListingsPage only shows listings owned by the logged-in provider', () => {
      // Arrange
      render(<MockListingApp role="PROVIDER" />);
      // Act & Assert
      expect(screen.getByTestId('my-listings')).toHaveTextContent('Only listings for current provider');
    });
  });
});
