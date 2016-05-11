package util;

use 5.010;
use strict;
use warnings;
use Exporter qw(import);

our @EXPORT_OK = qw(installFile);

sub installFile
{
    my $path        = shift;
    my $content     = shift;

    $content =~ s/\$/\\\$/g if $content=~/\$/;
    runCmd("cat >$path <<EOF\n$content\nEOF");
}
