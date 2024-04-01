# This file defines custom overlays
{
  # This one brings our custom packages from the `pkgs` directory
  additions = final: prev: import ../pkgs {pkgs = final;};

  # This one contains whatever you want to overlay
  # You can change versions, add patches, set compilation flags, anything really.
  # https://nixos.wiki/wiki/Overlays
  modifications = final: prev: {
    # Add custom python packages for all Python interpreter versions.
    pythonPackagesExtensions =
      prev.pythonPackagesExtensions
      ++ [
        (
          python-final: python-prev: {
            spectra = prev.callPackage ../pkgs/spectra {
              inherit (python-prev) buildPythonPackage colormath;
            };
          }
        )
      ];
  };
}
