// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterExoterra",
    products: [
        .library(name: "TreeSitterExoterra", targets: ["TreeSitterExoterra"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterExoterra",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterExoterraTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterExoterra",
            ],
            path: "bindings/swift/TreeSitterExoterraTests"
        )
    ],
    cLanguageStandard: .c11
)
