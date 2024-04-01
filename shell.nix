# Development environment
# You can enter it through `nix develop` or (legacy) `nix-shell`
{pkgs ? (import ./nixpkgs.nix) {}}: {
  default = pkgs.mkShell {
    nativeBuildInputs = with pkgs; [
      just

      (python3.withPackages(ps: with ps; [
        bottle
        spectra
        numpy
      ]))

      # Legacy Dependencies
      crow
      asio
    ];
  };
}
