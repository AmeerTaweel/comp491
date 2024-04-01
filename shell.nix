# Development environment
# You can enter it through `nix develop` or (legacy) `nix-shell`
{pkgs ? (import ./nixpkgs.nix) {}}: {
  default = pkgs.mkShell {
    nativeBuildInputs = with pkgs; [
      just

      (python3.withPackages(ps: with ps; [bottle]))

      # TODO: Remove legacy dependencies
      crow
      asio
    ];
  };
}
