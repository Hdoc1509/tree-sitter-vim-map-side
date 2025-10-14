import XCTest
import SwiftTreeSitter
import TreeSitterVimMapSide

final class TreeSitterVimMapSideTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_vim_map_side())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading VimMapSide grammar")
    }
}
