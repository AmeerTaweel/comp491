# Development environment
# You can enter it through `nix develop` or (legacy) `nix-shell`
{pkgs ? (import ./nixpkgs.nix) {}}: {
  default = pkgs.mkShell {
    nativeBuildInputs = with pkgs; [
      (python3.withPackages(ps: with ps; [
        bottle
        spectra
        numpy
        matplotlib
        pandas
      ]))

      # Legacy Dependencies
      crow
      asio
    ];
  };
}
