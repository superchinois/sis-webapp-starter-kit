'use client'
import { NextPage } from "next";
import * as React from "react"

import { User, users } from './users'
import { useFocusWithKeyboard, useScrollToInputWhenPanelOpens, useOnClickOutside } from './utils'
import { useTypeahead } from './useTypeahead'
import { Spinner } from "@/components/ui/spinner"

type Item = {
  itemcode: string
  itemname: string
  vente: number
  onhand: number
}

const Typeahead: NextPage = () => {
  const [pickedSuggestion, setPickedSuggestion] = React.useState<null | Item>(
    null,
  )

  const searchItem = async (query: string) => {
      const result = await fetch(`/api/items?search=${query}`,{
          method: "get",
          headers: {
            "Content-Type": "application/json",
          }
        });
      const results = await result.json();
      return results;
  }

  const onPick = (suggestion: Item) => {
    setPickedSuggestion(suggestion)
    clear()
  }

  const {
    inputRef,
    isOpen: isShowingSuggestions,
    isLoading,
    suggestions,
    value,
    handleChange,
    handleKeyUp,
    selected,
    clear,
  } = useTypeahead<Item>({
    search: React.useCallback(searchItem, []),
    onEnter: (suggestion, _selectedOption) => {
      onPick(suggestion)
    },
  })

  useScrollToInputWhenPanelOpens<Item>({
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

      <div className="max-w-[700px] flex flex-col" ref={inputContainerRef}>
        <div
          role="combobox"
          aria-label="Search"
          aria-expanded={isShowingSuggestions}
          aria-owns="search-listbox"
          aria-controls="search-listbox"
          aria-haspopup="listbox"
        >
          <input
            className="w-full border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none  "
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
          {isLoading?
          <Spinner />
          :null
        }
        </div>
        {isShowingSuggestions && (
          <div className="search-listbox-container max-h-[300px] overflow-auto shadow-lg" id="search-listbox">
            {suggestions?.length === 0 ? (
              <p>No results</p>
            ) : (
              <ul
                role="listbox"
                className="search-listbox scrollbar"
              >
                {suggestions?.map((suggestion, index) => (
                  <li
                    key={suggestion.itemcode}
                    aria-selected={index === selected}
                    id={`search-listbox-option-${index}`}
                    role="option"
                    className="search-listbox-suggestion aria-selected:bg-slate-400 hover:cursor-pointer hover:bg-slate-400"
                    onClick={() => onPick(suggestion)}
                  >
                    {suggestion.itemcode} ({suggestion.itemname})
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
            {pickedSuggestion.itemcode} (@{pickedSuggestion.itemname})<br />
          </p>

          <address>
            {pickedSuggestion.vente}
            <br />
            {pickedSuggestion.onhand}
            <br />
          </address>
        </>
      )}
    </main>
  )
}

export default Typeahead;