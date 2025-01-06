import XCTest
import SwiftTreeSitter
import TreeSitterExoterra

final class TreeSitterExoterraTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_exoterra())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Exoterra grammar")
    }
}
