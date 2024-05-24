# Development environment
# You can enter it through `nix develop` or (legacy) `nix-shell`
{pkgs ? (import ./nixpkgs.nix) {}}: {
  default = pkgs.mkShell {
    nativeBuildInputs = with pkgs; [
      nodejs
    ];
    shellHook = ''
      export PATH="$PWD/node_modules/.bin/:$PATH"
    '';
  };
}
