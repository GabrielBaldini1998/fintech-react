import { memo } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput = memo(({ value, onChange }: SearchInputProps) => (
  <div className="table-filter">
    <div className={`input-group ${value ? 'has-value' : ''}`}>
      <span className="input-group-text">
        <i className="bi bi-search"></i>
      </span>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar transações..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="btn"
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  </div>
));

SearchInput.displayName = 'SearchInput';

export default SearchInput;
