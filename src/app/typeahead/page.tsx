'use client'
import { NextPage } from "next";
import * as React from "react"

import { User, users } from './users'
import { useFocusWithKeyboard, searchUsers } from './utils'
import { useTypeahead } from './useTypeahead'


const Typeahead: NextPage = () => {
  const [pickedSuggestion, setPickedSuggestion] = React.useState<null | User>(
    null,
  )

  const onPick = (suggestion: User) => {
    setPickedSuggestion(suggestion)
    clear()
  }

  const {
    inputRef,
    isOpen: isShowingSuggestions,
    suggestions,
    value,
    handleChange,
    handleKeyUp,
    selected,
    clear,
  } = useTypeahead<User>({
    search: React.useCallback(async (query: string) => {
      const maxResults = 25
      return searchUsers(users, query).slice(0, maxResults)
    }, []),
    onEnter: (suggestion, _selectedOption) => {
      onPick(suggestion)
    },
  })

  useScrollToInputWhenPanelOpens({
    isShowingSuggestions,
    suggestions,
    inputRef,
  })

  useFocusWithKeyboard(inputRef)

  const inputContainerRef = React.useRef<HTMLDivElement>(null)
  useOnClickOutside(inputContainerRef, clear)

  return (
    <main>
      <p>
        <a href="#home">Home {'<<'}</a>
      </p>

      <h1>Simple Demo</h1>

      <div id="search-description">
        <p>Keyboard support:</p>

        <ul>
          <li>
            Use <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> <kbd>+</kbd> <kbd>Shift</kbd>{' '}
            <kbd>+</kbd> <kbd>F</kbd> to focus the input.
          </li>

          <li>
            Use <kbd>Esc</kbd> to clear the input.
          </li>

          <li>Use the arrow keys to highlight suggestions.</li>

          <li>
            Use <kbd>Home</kbd> and <kbd>End</kbd> to highlight the first and
            last result respectively.
          </li>

          <li>
            Use <kbd>PageUp</kbd> and <kbd>PageDown</kbd> to scroll through the
            suggestions container.
          </li>

          <li>
            Use <kbd>Enter</kbd> to select a suggestion
          </li>
        </ul>
      </div>

      <div ref={inputContainerRef}>
        <div
          role="combobox"
          aria-label="Search"
          aria-expanded={isShowingSuggestions}
          aria-owns="search-listbox"
          aria-controls="search-listbox"
          aria-haspopup="listbox"
        >
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none  "
            type="text"
            autoComplete="off"
            placeholder="Search"
            aria-label="Search"
            aria-controls="search-listbox"
            aria-activedescendant={
              selected == null ? undefined : `search-listbox-option-${selected}`
            }
            aria-describedby="search-description"
            aria-keyshortcuts="Control+Shift+f Meta+Shift+f"
            value={value}
            ref={inputRef}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
          />
        </div>

        {isShowingSuggestions && (
          <div className="search-listbox-container">
            {suggestions?.length === 0 ? (
              <p>No results</p>
            ) : (
              <ul
                id="search-listbox"
                role="listbox"
                className="search-listbox scrollbar"
              >
                {suggestions?.map((suggestion, index) => (
                  <li
                    key={suggestion.id}
                    aria-selected={index === selected}
                    id={`search-listbox-option-${index}`}
                    role="option"
                    className="search-listbox-suggestion aria-selected:bg-slate-400 hover:cursor-pointer hover:bg-slate-400"
                    onClick={() => onPick(suggestion)}
                  >
                    {suggestion.name} ({suggestion.username})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {pickedSuggestion && (
        <>
          <p>
            {pickedSuggestion.name} (@{pickedSuggestion.username})<br />
          </p>

          <address>
            {pickedSuggestion.phone}
            <br />
            {pickedSuggestion.email.toLowerCase()}
            <br />
          </address>
        </>
      )}
    </main>
  )
}

function useScrollToInputWhenPanelOpens({
  isShowingSuggestions,
  suggestions,
  inputRef,
}: {
  isShowingSuggestions: boolean
  suggestions: User[] | null
  inputRef: React.RefObject<HTMLInputElement>
}) {
  React.useEffect(() => {
    if (isShowingSuggestions && (suggestions?.length ?? 0) > 0) {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          const { top } = inputRef.current.getBoundingClientRect()
          window.scrollBy({
            top,
            behavior: 'smooth',
          })
        }
      })
    }
  }, [isShowingSuggestions, suggestions, inputRef])
}

function useOnClickOutside(
  ref: React.RefObject<Element>,
  handler: (e: Event) => void,
) {
  React.useEffect(() => {
    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

export default Typeahead;